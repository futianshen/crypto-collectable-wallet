import { LeftOutlined } from "@ant-design/icons"
import { Button, Card, Skeleton } from "antd"
import axios from "axios"
import { pick } from "ramda"
import { useQuery } from "react-query"
import { Link, useParams } from "react-router-dom"
import { object, string } from "yup"

const DetailPage: React.VFC = () => {
  const { id } = useParams<{ id: string }>()
  const [contractAddress, tokenId] = id.split("_")

  const { isLoading, isError, data } = useQuery(`asset_${id}`, () =>
    fetchAsset({ contractAddress, tokenId })
  )

  let content = null
  if (isLoading || !data) {
    content = <Skeleton active />
  }

  if (isError) {
    content = <span>error</span>
  }

  if (!!data) {
    content = (
      <Card
        cover={<img key={data.id} src={data.imgUrl} className="w-screen" />}
        bordered={false}
      >
        <Card.Meta title={data.name} description={data.description} />
        <a href={data.permalink} target="_blank">
          <Button className="mt-4" block>
            Link
          </Button>
        </a>
      </Card>
    )
  }

  return (
    <main>
      <header className="mb-3 p-3">
        <Link to="/" className="inline-flex items-center mr-2">
          <LeftOutlined />
        </Link>
        <span>{data?.collectionName}</span>
      </header>
      <section className="container mx-auto px-6">{content}</section>
    </main>
  )
}

const schema = object({
  id: string().required(),
  name: string().required(),
  description: string().nullable(),
  image_url: string().required(),
  collection: object({
    name: string().required(),
  }),
  permalink: string().required(),
}).required()

const fetchAsset = (params: { contractAddress: string; tokenId: string }) =>
  axios
    .get(
      `https://api.opensea.io/api/v1/asset/${params.contractAddress}/${params.tokenId}`
    )
    .then((res) => schema.validate(res.data))
    .then((asset) => schema.cast(asset) || {})
    .then((asset) => {
      return {
        ...pick(["id", "name", "description", "permalink"], asset),
        imgUrl: asset.image_url || "",
        collectionName: asset.collection.name || "",
      }
    })
    .catch((error) => {
      throw new Error(error)
    })

export default DetailPage
