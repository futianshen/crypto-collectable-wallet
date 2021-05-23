import { Button, Card, Skeleton } from "antd"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { fetchAsset } from "../apis"
import DetailLayout from "../layouts/DetailLayout"

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
    <DetailLayout prevPath="/" name={data?.collectionName || ""}>
      {content}
    </DetailLayout>
  )
}

export default DetailPage
