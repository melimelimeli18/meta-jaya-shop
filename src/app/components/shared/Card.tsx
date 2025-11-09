'use client';

import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'next/image';
import CustomButton from './Button';

interface CardProductProps {
  title: string;
  price: string;
  image: string;
  onDetailClick?: () => void;
}

const CardProduct: React.FC<CardProductProps> = ({
  title,
  price,
  image,
  onDetailClick,
}) => {
  return (
    <Card className="shadow-sm border-0 rounded-4 text-center" style={{ width: '18rem' }}>
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="rounded-top-4 object-fit-cover"
      />
      <Card.Body>
        <Card.Title className="fw-semibold fs-6">{title}</Card.Title>
        <Card.Text className="text-muted mb-3">{price}</Card.Text>
        <CustomButton label="Lihat Detail" onClick={onDetailClick} className="bg-white text-dark border border-1" />
      </Card.Body>
    </Card>
  );
};

export default CardProduct;
