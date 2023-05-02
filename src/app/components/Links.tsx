import React from 'react'
import LinkCard from './LinkCard'

type Link = {
  id: string;
  title: string;
  url: string;
}

type Props = {
  links: Link[];
  deleteLink: (id: string) => void;
}

const Links: React.FC<Props> = ({ links, deleteLink }) => {
  return (
    <>
      <div className='w-full md:w-3/4 mt-12'>
        <h2 className='text-xl'>Bookmarks</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-flow-row auto-rows-max gap-2 mb-2 mt-4 w-full md:w-3/4 mx-auto">
        {links.slice(0).reverse().map((link, index) => (
          <LinkCard key={index} link={link} deleteLink={deleteLink} />
        ))}
      </div>
    </>
  )
}

export default Links