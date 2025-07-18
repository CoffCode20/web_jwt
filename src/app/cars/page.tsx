
import FetchCar from '@/lib/api'
import React from 'react'
import DisplayProductComponent from "@/components/Display";
import {Car} from "../../lib/types";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Car Shop",
    description: "This is car show all product",
    keywords: ["car", "discount", "modern", "luxeri", "web development"],
    authors: [{ name: "Marta Full Stack" }],
    creator: "Matra",
    openGraph: {
        title: "Car Show page",
        description: "Car Shop website that you can explore and order",
        url: "",
        siteName: "Car Shop",
        images: [
            {
                url: "",
                width: 1200,
                height: 630,
                alt: "Car Rental Open Graph Image",
            },
        ],
    },
};
const ProductPage = async () => {
    const  data:Car[] = await FetchCar(0.5)
    console.log(data)
    return (
        <div>
            {/* <SWRComponent/> */}
            <DisplayProductComponent tagline={'Latest Updates'} heading={'New Comming'} description={'Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.'} buttonText={'View all cars'} buttonUrl={''} posts={data}/>
        </div>
    )
}

export default ProductPage
