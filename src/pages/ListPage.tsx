import { Button, Card, Skeleton } from "antd"
import axios from "axios"
import { flatten } from "ramda"
import { useInfiniteQuery } from "react-query"
import { Link } from "react-router-dom"
import { array, object, string } from "yup"
import DefaultLayout from "../layouts/DefaultLayout"

const ListPage: React.VFC = () => {
  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery("assets", fetchAssets, {
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
        <div>
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              block
            >
              Fetch More
            </Button>
          )}
        </div>
      </>
    )
  }

  return <DefaultLayout>{content}</DefaultLayout>
}

const schema = array(
  object({
    id: string().required(),
    token_id: string().required(),
    image_url: string().required(),
    name: string().required(),
    asset_contract: object({
      address: string().required(),
    }).nullable(),
  })
).required()

const fetchAssets = ({ pageParam = 0 }) =>
  axios
    .get(
      `https://api.opensea.io/api/v1/assets?format=json&owner=0x960DE9907A2e2f5363646d48D7FB675Cd2892e91&limit=20&offset=${pageParam}`
    )
    .then((res) => schema.validate(res.data.assets))
    .then((assets) => schema.cast(assets) || [])
    .then((list) => {
      return list.map((v) => ({
        id: v.id || "",
        imageUrl: v.image_url || "",
        name: v.name || "",
        assetContractAddress: v.asset_contract?.address || null,
        tokenId: v.token_id || "",
      }))
    })
    .catch((error) => {
      throw new Error(error)
    })

export default ListPage
