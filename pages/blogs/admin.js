import BlogTable from "@/components/blogs/blogTable"
import { Wrapper } from "@/components/Layout"
import Head from "next/head"
const BlogsT = () => {
	return (
		<>
			<Head>
				<title>Blogs List</title>
			</Head>
			<Wrapper>
				<div className="font-bold">
					<h1>Blogs</h1>
				</div>
				<BlogTable />
			</Wrapper>
		</>
	)
}

BlogsT.routeProtector = "AUTH"

export default BlogsT
