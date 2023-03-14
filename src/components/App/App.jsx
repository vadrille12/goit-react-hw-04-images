import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Searchbar } from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import s from 'components/Styles.module.css';
import Button from 'components/Button/Button';
import pixabayApi from 'components/Api/Api';

import { Modal } from 'components/Modal/Modal';
import Spinner from 'components/Loader/Spinner';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [query, setQuery] = useState([]);
  const [page, setPage] = useState(1);
  const [searhQuery, setSearhQuery] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [error, setError] = useState(null);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setStatus('pending');

    pixabayApi
      .fetchQuery(query, page)
      .then(({ hits, totalHits }) => {
        const images = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return { id, webformatURL, largeImageURL, tags };
        });
        if (images.length > 0) {
          setQuery(state => [...state, ...images]);
          setStatus('resolved');
          setShowBtn(page < Math.ceil(totalHits / 20));
        } else {
          toast.error(`По запросу ${query} ничего не найдено.`);
          setStatus('idle');
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
  }, [query, page]);

  const handleSubmitInput = newQuery => {
    if (newQuery !== searhQuery) {
      setQuery([]);
      setSearhQuery(newQuery);
      setPage(1);
      setStatus('pending');
    }
  };

  const handleClickImg = event => {
    const imgForModal = event.target.dataset.src;
    const altForModal = event.target.alt;
    setShowModal(true);
    setModalImg(imgForModal);
    setModalAlt(altForModal);
  };

  const handleClickBtn = () => {
    setPage(state => state + 1);
    setStatus('pending');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (status === 'idle') {
    return (
      <div>
        <Searchbar onSubmit={handleSubmitInput} />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div>
        <Searchbar onSubmit={handleSubmitInput} />
        {query.length > 0 && <ImageGallery query={query} />}
        <Spinner className={s.Loader} />
      </div>
    );
  }

  if (status === 'rejected') {
    return <h1>{error.message}</h1>;
  }

  if (status === 'resolved') {
    return (
      <>
        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={modalImg} alt={modalAlt} />
          </Modal>
        )}
        <div>
          <Searchbar onSubmit={handleSubmitInput} />
          <ImageGallery onClickImg={handleClickImg} query={query} />
          {showBtn && <Button handleClickBtn={handleClickBtn} />}
        </div>
      </>
    );
  }
}
