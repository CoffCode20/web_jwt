import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Car } from "@/lib/types";

interface Blog7Props {
    tagline: string;
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    posts: Car[]
}

export default function DisplayProductComponent({
    tagline = "Latest Updates",
    heading = "Blog Posts",
    description = "Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.",
    buttonText = "View all articles",
    buttonUrl = "",
    posts
}: Blog7Props){
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              {tagline}
            </Badge>
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              {heading}
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
              {description}
            </p>
            <Button variant="link" className="w-full sm:w-auto" asChild>
              <a href={buttonUrl} target="_blank">
                {buttonText}
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="grid grid-rows-[auto_auto_1fr_auto] pt-0"
              >
                <div className="aspect-16/9 w-full">
                  <a
                    href={post.make}
                    target="_blank"
                    className="transition-opacity duration-200 fade-in hover:opacity-70"
                  >
                    {post.image?.startsWith("/") ||
                    post.image?.startsWith("http") ? (
                      <Image
                        src={post.image}
                        width={500}
                        height={500}
                        alt={post.make}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </a>
                </div>
                <CardHeader>
                  <h3 className="text-lg font-semibold hover:underline md:text-xl">
                    <a href={post.make} target="_blank">
                      {post.make}
                    </a>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.description}</p>
                </CardContent>
                <CardFooter>
                  <a
                    href={post.make}
                    target="_blank"
                    className="flex items-center text-foreground hover:underline"
                  >
                    Read more
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
};

