import Link from 'next/link'
import React from 'react'
import Topic from 'types/topic'
import topics from 'data/topics'
import Image from 'next/image'

function TopicsList() {
  return (
    <div className="pt-10">
      <h1 className="pb-4 text-lg font-semibold">Posts by Topics 👨‍💻</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.keys(topics).map((topic) => <TopicRow key={topic} topic={topics[topic]} />)}
      </div>
    </div>
  )
}

interface TopicRowProps { topic: Topic }
function TopicRow({ topic }: TopicRowProps) {
  return (
    <Link href={`/topics/${topic.id}`}>
      <a className="flex p-5 border rounded hover:shadow-around transition-shadow translate transform group items-center cursor-pointer relative">
        <div className="flex px-2 w-16 absolute right-5">
          <Image src={topic.icon} alt={topic.id} width={50} height={50} />
        </div>
        <h2 className="text-xl font-bold tracking-wider text-gray-600 group-hover:text-blue-700">{topic.text}</h2>
      </a>
    </Link>
  )
}


export default TopicsList
