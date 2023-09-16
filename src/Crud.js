import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
function Crud() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [data, setData] = useState([]);
  const [idUpdate, setIdupdate] = useState("");
  const [showDel, setShowDel] = useState(false);
  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => setShowDel(true);
  const [delId, setdelId] = useState("");
  //Formik
  const formik = useFormik({
    initialValues: {
      _id: "",
      userId: "",
      title: "",
      body: "",
    },
    onSubmit: (values) => {
      idUpdate ? updateData(idUpdate, values) : postData(values);

      formik.handleReset();
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("Enter userId"),
      title: Yup.string().required("Enter Title"),
      body: Yup.string().min(3).max(2500).required("Enter body"),
    }),
  });

  // Get Data
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((respone) => {
      setData(respone.data);
      console.log("GetApi", respone);
    });
  }, []);
  //Post Data
  const postData = (values) => {
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        userId: values.userId,
        title: values.title,
        body: values.body,
        _id: Math.random(),
      })
      .then((response) => {
        setData([...data, response.data]);
      });
    console.log("data", data);
  };
  //Edit

  const edit = (updateId, userId, title, body) => {
    formik.setValues({ userId, title, body });
    setIdupdate(updateId);
  };

  //Delete

  const deleteItem = (id) => {
    axios
      .delete("https://jsonplaceholder.typicode.com/posts/" + id)
      .then((response) => {
        console.log("delte", response);
        const delteData = data.filter((deleteId) => deleteId._id !== id);
        setData(delteData);
      });
  };

  const updateData = (id, values) => {
    console.log("val", values);
    axios
      .patch("https://jsonplaceholder.typicode.com/posts/" + id, {
        userId: values.userId,
        title: values.title,
        body: values.body,
        _id: idUpdate,
      })
      .then((response) => {
        console.log("data", idUpdate);
        const updatedData = data.map((state) =>
          state._id === response.data._id ? response.data : state
        );
        console.log(updatedData, "updateData");

        setData(updatedData);
      });
  };

  return (
    <>
      <Button variant="primary" className="button" onClick={handleShow}>
        Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>User id</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Id"
                autoFocus
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
              {formik.touched.userId && formik.errors.userId ? (
                <div className="error">{formik.errors.userId}</div>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tilte"
                autoFocus
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="error">{formik.errors.title}</div>
              ) : (
                ""
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                autoFocus
                name="body"
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
              {formik.touched.body && formik.errors.body ? (
                <div className="error">{formik.errors.body}</div>
              ) : (
                ""
              )}
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Table bordered hover>
        <thead>
          <tr>
            <th>userId</th>
            <th>Tilte</th>
            <th>Description</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr key={item._id}>
                <td>{item.userId}</td>
                <td>{item.title}</td>
                <td>{item.body}</td>
                <td>
                  {" "}
                  <Button
                    variant="Dark"
                    className="bg-danger mt-3 mx-2"
                    onClick={() => {
                      handleShowDel();
                      setdelId(item._id);
                    }}
                  >
                    Delete
                  </Button>
                </td>

                <td>
                  <Button
                    variant="Dark"
                    className="bg-success mt-3 mx-2"
                    onClick={() => {
                      edit(item._id, item.userId, item.title, item.body);
                      handleShow();
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={showDel} onHide={handleCloseDel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are your sure want to delete this blog ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteItem(delId);
              handleCloseDel();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Crud;
