import React, { useState } from 'react';
import { addSection } from '../firebaseService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure bootstrap styles are imported
import './SectionInput.css'; // Import the CSS file for styling

const SectionInput = () => {
    const [showModal, setShowModal] = useState(false);
    const [sectionName, setSectionName] = useState('');

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sectionName.trim()) {
            toast.error("Section name cannot be empty.");
            return;
        }

        try {
            await addSection(sectionName.trim());
            toast.success(`Section "${sectionName.trim()}" added successfully!`);
            setSectionName("");
            handleClose(); // Close modal after successful submission
        } catch (err) {
            toast.error("Failed to add section. Please try again.");
            console.error("Error adding section:", err);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <Button
                className="floating-btn"
                variant="btn btn-light"
                onClick={handleShow}
            >
                +
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="sectionName">
                            <Form.Label>Enter Section Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Section name"
                                value={sectionName}
                                onChange={e => setSectionName(e.target.value)}
                            />
                        </Form.Group>
                        <div className="mt-3 text-end">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="ms-2">
                                Add Section
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SectionInput;