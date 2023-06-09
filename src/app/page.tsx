'use client'

import { Inter } from 'next/font/google'
import Links from './components/Links'
import { useEffect, useRef, useState } from 'react'
import { formatUrl, isValidHttpUrl, fetchUrlMetadata } from './utils/helper'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { Toaster, toast } from 'react-hot-toast'
import { RiLink } from "react-icons/ri";
import { HiHeart } from "react-icons/hi2";

type Link = {
  id: string,
  title: string;
  url: string;
}

export default function Home() {

  const textInput = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string>('')
  const [links, setLinks] = useState<Link[]>([])
  const [hasValidUrl, setHasValidUrl] = useState<boolean>(false)
  const Dialog = withReactContent(Swal)


  let linksCollection: Link[] = []

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus()
    }

    const linksFromLocalStorage = localStorage.getItem('links')
    linksCollection = linksFromLocalStorage ? JSON.parse(linksFromLocalStorage) : []
    setLinks(linksCollection)
  }, [])

  useEffect(() => {
    setHasValidUrl(false)
    let formattedUrl: URL | undefined

    if (url !== '') {
      formattedUrl = formatUrl(url)
    }

    if (url !== '' && !isValidHttpUrl(formattedUrl?.href)) {
      searchLinks()
    }


    if (url === '' && isValidHttpUrl(formattedUrl?.href)) {
      const linksFromLocalStorage = localStorage.getItem('links')
      linksCollection = linksFromLocalStorage ? JSON.parse(linksFromLocalStorage) : []
      setLinks(linksCollection)
      textInput.current!.focus()
    }

    if (isValidHttpUrl(formattedUrl?.href)) {
      setHasValidUrl(true)
    }
  }, [url])

  const searchLinks = () => {
    const linksFromLocalStorage = localStorage.getItem('links');
    const links: Link[] | null = linksFromLocalStorage ? JSON.parse(linksFromLocalStorage) : [];
    const filteredLinks: Link[] = links?.filter((link: Link) => link.title?.toLowerCase().includes(url.toLowerCase())) ?? []

    setLinks(filteredLinks)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveLink()
    }
  }

  async function saveLink() {
    const formattedUrl = formatUrl(url);

    if (!formattedUrl || !isValidHttpUrl(formattedUrl)) {
      toast.error('Please enter a valid URL')
      return
    }

    if (checkLinkExists(formattedUrl)) {
      toast.error('You already have save this link')
      return
    }

    linksCollection = await fetchUrlMetadata(formattedUrl)
    reloadLinks(linksCollection)
  }

  function reloadLinks(links: Link[]) {
    if (!links) {
      return
    }

    toast.success('Link successfully added')
    setLinks(links)
    setUrl('')
  }

  function checkLinkExists(url: URL) {
    const linksFromLocalStorage = localStorage.getItem('links')

    if (!linksFromLocalStorage) {
      return false
    }

    const links: Link[] = JSON.parse(linksFromLocalStorage)
    const filteredLinks: Link[] = links.filter(link => link.url === url.href) ?? []
    return filteredLinks.length > 0
  }

  function deleteLink(id: string) {
    Dialog.fire({
      text: 'Do you want to delete this link?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(22 163 74)',
      cancelButtonColor: 'rgb(153 27 27)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const linksFromLocalStorage = localStorage.getItem('links') as string;
        const links: Link[] = JSON.parse(linksFromLocalStorage)
        const filteredLinks = links.filter(link => link.id !== id)
        localStorage.setItem('links', JSON.stringify(filteredLinks))
        setLinks(filteredLinks)
        toast.success('Link has been deleted')
      }
    })
  }


  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <main className="flex min-h-screen flex-col items-center justify-between py-24 px-8">
        <div className="w-full items-center justify-between font-mono text-sm lg:flex lg:flex-col">
          <div className='w-full md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center mx-auto'>
            <div className="flex flex-row justify-center items-center gap-1.5 mb-2">
              <RiLink className='w-8 h-8 text-blue-500' />
              <h1 className='my-2 text-2xl md:text-3xl '>LinkSave</h1>
            </div>

            {/* SEARCH */}
            <input
              ref={textInput}
              value={url}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              type="text"
              name="url"
              id="url"
              className='w-full border bg-gray-100 outline-none focus:outline-none focus:ring rounded-lg
        py-4 px-4'
              placeholder="Paste link to save or Search" />
          </div>

          {links?.length > 0 && (
            <Links links={links} deleteLink={deleteLink} />
          )}
        </div>
      </main>

      <footer className="text-center py-4">
        <p className="text-xs flex flex-row gap-1 justify-center item-center text-gray-600">Made with <HiHeart className="text-lg text-red-600" /> by <a href="https://jestoni.vercel.app">Jestoni</a></p>
      </footer>
    </>
  )
}
