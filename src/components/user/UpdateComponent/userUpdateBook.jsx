import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import { useSelector } from 'react-redux';

import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import Cookies from 'js-cookie';

import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';
import './userUpdateBook.css';

const UploadProduct = () => {
  const navigate = useNavigate();
  const productId = useParams('id');

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [type, setType] = useState('books');
  const [classPopUp, setClassPopUp] = useState(false);
  const [subjectPopUp, setSubjectPopUp] = useState(false);
  const [boardPopUp, setBoardPopUp] = useState(false);
  const [languagePopUp, setLanguagePopUp] = useState(false);
  const [userData, setUserData] = useState('');
  const [allField, setallField] = useState(true);

  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);

  const [formData, setFormData] = useState({
    class: 'class',
    language: 'language',
    board: 'board',
    subject: 'subject',
    title: '', // for title
    description: '', // for description
    price: '', // for price
    discountedPrice: '', // for discounted price
    keywords: '', // for keywords
    author: '', // for author name
    buyingYear: '',
    pinCodes: '740001,740002,740003,742136'
  });
  const [images, setImages] = useState([null, null, null]);
  const [imagesToDelete, setImagesToDelete] = useState([]);


  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUser');
    if (userSession) {
      setUserData(JSON.parse(userSession));
    }
  }, []);

  const products = useSelector((state) => state.userAllRefurbishedProducts.allRefurbishedProducts);
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        const filteredProducts = products.filter((product) => product.$id === productId.id);
        setFormData({
          class: filteredProducts[0]?.class,
          language: filteredProducts[0]?.language,
          board: filteredProducts[0]?.board,
          subject: filteredProducts[0]?.subject,
          title: filteredProducts[0]?.title,
          description: filteredProducts[0]?.description,
          price: filteredProducts[0]?.price,
          discountedPrice: filteredProducts[0]?.discountedPrice,
          keywords: filteredProducts[0]?.keywords.join(','),
          author: filteredProducts[0]?.author,
          buyingYear: '',
          pinCodes: '740001,740002,740003,742136'
        });

        const updatedImages = [...filteredProducts[0].images];
        for (let i = updatedImages.length; i < 3; i++) {
          updatedImages.push(null);
        }
        setImages(updatedImages);
        setImagesToDelete(updatedImages);

      }
    };
    fetchProductData();
  }, []);



  const handleImageChange = (index, files) => {
    if (files && files[0]) {
      const updatedImages = [...images];
      updatedImages[index] = files[0];
      setImages(updatedImages);
    }
  };

  const handleDrop = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    handleImageChange(index, files);
  };

  const triggerFileInput = (index) => {
    document.getElementById(`image-update-${index}`).click();
  };

  const removeImage = (index) => {
    if (typeof (images[index]) === 'string') {
      const publicId = images[index];
      setToDeleteImagesUrls((prevUrls) => [...prevUrls, publicId]);
    }
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const handleClassSelect = (selectedClass) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      class: Number(selectedClass),
    }));
    setClassPopUp(false);
  };

  const handleSubjectSelect = (selectedSubject) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subject: selectedSubject,
    }));
    setSubjectPopUp(false);
  };

  const handleBoardSelect = (selectedBoard) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      board: selectedBoard,
    }));
    setBoardPopUp(false);
  };

  const handleLanguageSelect = (selectedLanguage) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      language: selectedLanguage,
    }));
    setLanguagePopUp(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.class ||
      !formData.language ||
      !formData.board ||
      !formData.subject ||
      !formData.title ||
      !formData.price ||
      !formData.discountedPrice
    ) {
      setallField(false);
      console.log("error")
      return;
    }
    try {
      console.log("here")
      const updatedData = formData;
      userUploadBooks.updateUserRefurbishedProduct(productId, toDeleteImagesUrls, updatedData, images);
    } catch (error) {
      console.log("error")
    }
  };

  const handleDelete = async () => {
    try {
      await userUploadBooks.deleteProduct(productId, imagesToDelete);
      alert("Delete successful");
    } catch (error) {
      console.error("Error in deleting product:", error);
    }
  };

  return (
    <>
      hi

    </>
  );
};

export default UploadProduct;

