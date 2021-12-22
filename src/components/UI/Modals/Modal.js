import styles from './Modal.module.css';
import ReactDOM from 'react-dom';



const Modal = (props) => {
  return ReactDOM.createPortal(
    <>
      <div className={styles.backdrop} onClick={props.onCloseCart}></div>
      <div className={styles.modal}>{props.children}</div>
    </>, document.getElementById('portal')
  );
};

export default Modal;
