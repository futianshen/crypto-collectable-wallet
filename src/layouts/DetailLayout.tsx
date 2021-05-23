import { LeftOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

const DetailLayout: React.FC<{ prevPath: string; name: string }> = ({
  prevPath,
  name,
  children,
}) => (
  <main>
    <header className="mb-3 p-3">
      <Link to={prevPath} className="inline-flex items-center mr-2">
        <LeftOutlined />
      </Link>
      <span>{name}</span>
    </header>
    <section className="container mx-auto px-6">{children}</section>
  </main>
)

export default DetailLayout
