import format from 'date-fns/format';
import Head from 'next/head';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const route = useRouter();

  if (route.isFallback) {
    return <p>Carregando...</p>;
  }


  const totalTime = post.data.content.reduce((acc, content) => {
    const total = RichText.asText(content.body).split(' ');

    const min = Math.ceil(total.length / 200);
    return acc + min;
  }, 0);

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );


  return (
    <>
      <Header />

      <img className={styles.banner} src={post.data.banner.url} alt="banner" />
      
      <main className={styles.postContainer}>
        <strong>{post.data.title}</strong>
        <div className={styles.postInfo}>
          <time>
            <FiCalendar />
            {formatedDate}
          </time>
          <span>
            <FiUser />
            {post.data.author}
          </span>

          <span>
            <FiClock />
            {totalTime} min
          </span>
        </div>
        <section className={styles.postContent}>
          {post.data.content.map(content => (
            <h2 key={content.heading}>
              <strong>{content.heading}</strong>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
              />
            </h2>
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(Prismic.predicates.at['type.posts']);

  const paths = posts.results.map(post => {
    return {
      params: { 
          slug: post.uid 
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});


  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 1800,
  };
};