import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useAuth } from 'auth';
import Modal from 'components/Modal';
import Close from '../../../public/icons/close.svg';
import styles from './ModalNavMenu.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function ModalNavMenu({isopen, close, isAuthenticated }) {

    return (
        <Modal classname={styles.modalBase} open={isopen} onClose={() => close(false)}>
            <Close onClick={() => {close(false);}} className={cx('closeButton')} type="button" />
            <Link href="/"><a>Home</a></Link>
            <Link href="/resources"><a>Resources</a></Link>
            <Link href={{ pathname: '/resources', query: { categories: 'WIFI' } }}>
                <a>Wifi Hotspot</a>
            </Link>
            {
                isAuthenticated
                ? (
                    <>
                    {/* Links that only display for authenticated users */}
                    <Link href="/admin/manager"><a>Admin Manager</a></Link>
                    </>
                )
                : (
                    <>
                    {/* Links that only display for unauthenticated users */}
                    <a href="https://occurnow.org/contact">Contact</a>
                    </>
                )
            }
        </Modal>
    )
}

ModalNavMenu.propTypes = {
    isopen : PropTypes.bool.isRequired,
    close : PropTypes.func.isRequired,
    isAuthenticated : PropTypes.bool.isRequired,
}
