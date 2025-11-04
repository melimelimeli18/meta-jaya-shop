'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function DashboardHeader() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    };

    return (
        <Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={Link} href="/admin/catalog">
                    <Image
                        src="/images/MetaJaya.png"
                        alt="MetaJaya Logo"
                        width={50}
                        height={50}
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll" />
               
                <Navbar.Collapse id="navbarScroll" className='justify-content-between'>
                    <Nav
                        className="mx-auto my-2 my-lg-0 text-center"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} href="/admin/catalog">
                            Katalog
                        </Nav.Link>
                       
                        <Nav.Link as={Link} href="/admin/edit-hero">
                            Edit Hero
                        </Nav.Link>
                       
                        <Nav.Link as={Link} href="/admin/edit-privacy">
                            Edit Policy
                        </Nav.Link>
                       
                        <Nav.Link as={Link} href="/admin/edit-produk-unggulan">
                            Edit Produk Unggulan
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        <Nav.Link
                            onClick={handleLogout}
                            className="text-danger fw-semibold"
                        >
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default DashboardHeader;