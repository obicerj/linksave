import React from 'react'
import { extractDomainName } from '../utils/helper';
import { FiTrash2 } from "react-icons/fi"

type Link = {
  id: string;
  title: string;
  url: string;
};

type Props = {
  link: Link;
  deleteLink: (id: string) => void;
};

const LinkCard: React.FC<Props> = ({ link, deleteLink }) => {
  return (
    <div className="flex p4 bg-slate-50 hover:shadow-md hover:shadow-slate-300 
          transition east-in-out duration-200 
          hover:scale-105
          rounded-lg pt-4 pb-4">
      <div className="w-11/12">
        <a href={link.url} target="_blank">
          <div className="px-4">
            <img src={'https://' + extractDomainName(link.url ?? '') + '/favicon.ico'} className="w-4 h-4" />
          </div>

          <div className="flex justify-between px-4 mt-1.5">
            <div className="flex flex-row items-center gap-2">

              <p className='text-slate-500 text-xs'>
                {extractDomainName(link.url ?? '')}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center px-4 mt-2">
            <p className=''>
              {link.title ?? extractDomainName(link.url ?? '')}
            </p>
          </div>
        </a>
      </div>

      <div className="w-1/12">
        <a className="hover:cursor-pointer" onClick={() => deleteLink(link.id)} title="Delete link">
          <FiTrash2 />
        </a>
      </div>

    </div>
  )
}

export default LinkCard