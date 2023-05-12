import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/getAllArticles'
import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/formatDate'
import { paginate } from '@/lib/paginate'
import { Pagination } from '@/components/Paginate'
import { Router, useRouter } from 'next/router'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function SearchIndex({ articles }) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3
  const router = useRouter()
  if (router.query.search) {
    // console.log(`query = ${router.query.search}`)
    articles = articles.filter((article) => {
      const res = article.indexing?.split(' ').map((element) => {
        console.log(element)
        if (element == router.query.search) return true
        else return false
      })
      console.log(res)

      if (res && res.includes(true)) {
        // console.log('11')
        return true
      } else {
        // console.log('22')
        return false
      }
    })
    // console.log(`article.size : ${articles.length}`)
  }
  const showArticles = paginate(articles, currentPage, pageSize)
  // console.log(`showArticles.size : ${showArticles.length}`)
  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Head>
        <title>Articles - Hyungmin Kang</title>

        <meta
          name="description"
          content="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
        />
      </Head>
      <SimpleLayout
        title="Writing on software design, algorithms, and the big things to note"
        intro="I think the following lists are challenging and very helpful to other people. So, I want to share my idea and communicate with it. Fell free to contact me."
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          {/* <div className="flex max-w-3xl flex-col space-y-16"> */}
          <div className="flex max-w-3xl flex-col space-y-16">
            {showArticles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
      <Pagination
        items={articles.length} // 100
        currentPage={currentPage} // 1
        pageSize={pageSize} // 10
        onPageChange={onPageChange}
      />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
      totalArticles: (await getAllArticles()).map(
        ({ component, ...meta }) => meta
      ),
    },
  }
}
