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
    <div className="grid md:grid-cols-2 grid-flow-row auto-rows-max gap-2 mt-8 mb-2">
      {links.slice(0).reverse().map((link, index) => (
        <LinkCard key={index} link={link} deleteLink={deleteLink} />
      ))}
    </div>
  )
}

export default Links