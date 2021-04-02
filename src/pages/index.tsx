import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

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

export default function Home({posts} : Post) {
  // TODO
}

export const getStaticProps : GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: [ 
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.heading',
        'post.body']
    },
  )};


  const posts = postsResponse.results.maps(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
    }
  })

    return {
      props : {
        posts
      }
    }

}