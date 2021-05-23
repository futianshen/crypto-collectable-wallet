import axios from "axios"
import { pick } from "ramda"
import { handleError } from "../helpers"
import { assetCollectionSchema, assetSchema } from "../schemas"

const fetchAssetCollection = ({ pageParam = 0 }) =>
  axios
    .get(
      `https://api.opensea.io/api/v1/assets?format=json&owner=0x960DE9907A2e2f5363646d48D7FB675Cd2892e91&limit=20&offset=${pageParam}`
    )
    .then((res) => assetCollectionSchema.validate(res.data.assets))
    .then((assets) => assetCollectionSchema.cast(assets) || [])
    .then((list) => {
      return list.map((v) => ({
        id: v.id || "",
        imageUrl: v.image_url || "",
        name: v.name || "",
        assetContractAddress: v.asset_contract?.address || null,
        tokenId: v.token_id || "",
      }))
    })
    .catch(handleError)

const fetchAsset = (params: { contractAddress: string; tokenId: string }) =>
  axios
    .get(
      `https://api.opensea.io/api/v1/asset/${params.contractAddress}/${params.tokenId}`
    )
    .then((res) => assetSchema.validate(res.data))
    .then((asset) => assetSchema.cast(asset) || {})
    .then((asset) => {
      return {
        ...pick(["id", "name", "description", "permalink"], asset),
        imgUrl: asset.image_url || "",
        collectionName: asset.collection.name || "",
      }
    })
    .catch(handleError)

export { fetchAssetCollection, fetchAsset }
