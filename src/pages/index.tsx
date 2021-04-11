import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState, useEffect, ReactElement } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'node:constants';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps) : JSX.Element{
  // TODO


  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  // const [currentPage, setCurrentPage] = useState(1);

  function handlePagination(): void {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(jsonData => {
        const newPosts = jsonData.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: post.data,
          };
        });
        setPosts(oldPosts => [...oldPosts, ...newPosts]);
      });
  }

  
  
  
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.postContainer}>
        <div className={styles.postList}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfo}>
                  {/* <time>
                    <FiCalendar />
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time> */}
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage && (
          <button
            className={styles.loadMorePostsButton}
            type="button"
            onClick={handlePagination}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.author', 'posts.subtitle'],
      pageSize: 1,
    }
  );


  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: post.data
    };
  });


  const postsPagination = {
    next_page: response.next_page, 
    results:posts
  }

  return {
    props: {
      postsPagination
    },
    revalidate: 60 * 60 * 24,
  };
};
