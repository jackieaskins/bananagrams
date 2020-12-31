import { Button, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { addDisconnectListener } from '.';

const SocketDisconnectModal = (): JSX.Element => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { push } = useHistory();

  useEffect(() => {
    addDisconnectListener(() => {
      setShouldShowModal(true);
    });
  }, []);

  const hideModal = useCallback(() => {
    push('/');
    setShouldShowModal(false);
  }, [push]);

  return (
    <Modal
      closable={false}
      footer={<Button onClick={hideModal}>Return home</Button>}
      title="Disconnected"
      visible={shouldShowModal}
    >
      You have been disconnected from the server
    </Modal>
  );
};

export default SocketDisconnectModal;
