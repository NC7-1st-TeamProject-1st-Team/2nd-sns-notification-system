import React, { useState, useEffect } from 'react';
import qs from 'qs';
import NotificationListModalComponent from '../../components/notification/NotificationListModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { notiList, readAllNoti, readNoti } from '../../modules/notification';
import Modal from '../../components/common/Modal';
import { useLocation } from 'react-router-dom';

//기존 알림 -> 페이지네이션 삭제
const NotificationListModalContainer = ({ onClose }) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { user, notis, lastPage, error } = useSelector(({ auth, notification }) => ({
    user: auth.user,
    notis: notification.notis,
    lastPage: notification.lastPage,
    error: notification.error,
  }));

  useEffect(() => {
    if (user) {
      dispatch(notiList({ memberNo: user.no, limit: 5, page: 1 })); // Set limit and page to 1
    }
  }, [user, dispatch]);

  const onReadNotiLog = (e) => {
    const { name } = e.target;
    dispatch(readNoti({ _id: name }));
  };

  const onReadAllNotiLog = () => {
    dispatch(readAllNoti({ memberNo: user.no }));
  };

  return (
      <Modal onClose={onClose}>
        <NotificationListModalComponent
            notis={notis}
            onReadNotiLog={onReadNotiLog}
            onReadAllNotiLog={onReadAllNotiLog}
        />
      </Modal>
  );
};

export default NotificationListModalContainer;
