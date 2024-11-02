import { ReactNode } from 'react'
import type { History } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<History, '_id' | '_raw' | 'body'>
}

export default function HistoryLayout({ children, content }: Props) {
  const { name, image } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {name}
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          {/* <div className="flex flex-col items-center space-x-2 pt-8">
            {image && (
              <Image
                src={image}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            )}
          </div> */}
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
