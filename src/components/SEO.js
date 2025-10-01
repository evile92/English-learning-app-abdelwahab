// src/components/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "StellarSpeak - منصة تعلم اللغة الإنجليزية التفاعلية",
  description = "تعلم اللغة الإنجليزية مع StellarSpeak - منصة تفاعلية تقدم دروساً مجانية، اختبارات مستوى، وأدوات تعليمية متقدمة لتحسين مهاراتك",
  keywords = "تعلم الإنجليزية, دروس إنجليزية مجانية, قواعد اللغة الإنجليزية, اختبار مستوى الإنجليزية, مفردات إنجليزية",
  image = "https://stellarspeak.online/logo512.png",
  url = "https://stellarspeak.online",
  type = "website",
  author = "فريق StellarSpeak"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph Tags للفيسبوك */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="StellarSpeak" />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@stellarspeak" />
      
      {/* Additional SEO Meta */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />
      <link rel="canonical" href={url} />
      
      {/* Language and Direction */}
      <meta httpEquiv="content-language" content="ar" />
      <meta name="language" content="Arabic" />
    </Helmet>
  );
};

export default SEO;
