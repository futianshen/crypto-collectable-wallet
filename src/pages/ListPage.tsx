import { Card, Skeleton, Spin } from "antd"
import { flatten } from "ramda"
import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchAssetCollection } from "../apis"
import DefaultLayout from "../layouts/DefaultLayout"

const ListPage: React.VFC = () => {
  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery("assets", fetchAssetCollection, {
    getNextPageParam: (lastPages, pages) =>
      lastPages.length === 20 ? flatten(pages).length + 1 : undefined,
  })

  let content = null
  if (isLoading || !data) {
    content = <Skeleton active />
  }

  if (isError) {
    content = <span>error</span>
  }

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage) {
      return
    }

    const element = ref.current
    if (!element) {
      return
    }

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((v) => v.isIntersecting && fetchNextPage())
    )
    observer.observe(element)

    return () => observer.unobserve(element)
  }, [hasNextPage, ref.current])

  if (!!data) {
    content = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {flatten(data.pages).map((v) => (
            <Link
              key={v.id}
              to={`/asset/${v.assetContractAddress}_${v.tokenId}`}
            >
              <Card cover={<img src={v.imageUrl} />}>
                <h3 className="text-center">{v.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
        <div ref={ref} className="text-center">
          {isFetchingNextPage && <Spin />}
        </div>
      </>
    )
  }

  return <DefaultLayout>{content}</DefaultLayout>
}

export default ListPage
