import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

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
  response: any;
  posts: any;
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  // TODO
  const [results, setResults] = useState(props.posts)
  
  function handleNextPagination(e){
    e.preventDefault();
    
    if(props.response.next_page){
      fetch(props.response.next_page)
          .then(response => {return response.json()})
          .then(data => setResults([...results, data.results[0]]))
          .catch(err => alert(err));  
      
          // setResults([...results, response])
        // (props.response.next_page.results)
   }

   return results;

   console.log(results)
  }



  return (
    <>
      <Head>
        <title>Posts | Spacejam</title>
      </Head>
    
       <div className={`${commonStyles.commonContainer} ${styles.ContainerHome}`}>
        {props.response.next_page && (results.map(post => (
          <main className={styles.container} key={post.slug}>
              <div className={styles.posts} >
                  <Link href={`/post/${post.slug}`}>
                    <a >
                      <h1>{post.title}</h1>
                    </a>
                  </Link>
                  <p>{post.subtitle}</p>
                  <div className={commonStyles.commonInfo}>
                    <div>
                      <FiCalendar color="#B8B8B8"/> <span>{post.updatedAt}</span>
                    </div> 
                    <span>
                        <FiUser color="#B8B8B8"/> <span>{post.author}</span>
                    </span> 
                  </div>
              </div>

             {props.response.next_page && 
             <h2> 
               <button onClick={handleNextPagination}>
                   Carregar posts
                </button>
              </h2>}

          </main>
        )))}

      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
          'posts.title',
          'posts.subtitle', 
          'posts.author',
        ],
      pageSize: 1,
    }
  );


  // console.log(response);

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: RichText.asText(post.data.subtitle),
      author: RichText.asText(post.data.author),
      updatedAt: format(
        new Date(post.last_publication_date),
        "dd MMM yyyy",
        {
          locale: ptBR,
        }
      )
    };
  });


  return {
    props: {
      posts,
      response
    },
  };
};
