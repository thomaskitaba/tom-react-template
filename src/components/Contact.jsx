// import Chief from '../assets/img/chief.png';
// import Chief2 from '../assets/img/chief-2.png';
import {useState, useEffect, useContext} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {X } from 'react-bootstrap-icons';
import axios from 'axios';
import {checkEmail, checkTextExist, checkPhone } from './UtilityFunctions';


const Contact = () => {

  const [userId, setUserId] = useState(0);
  const [myApiKey] = useState('');
  // const [endpoint, setEndpoint] = useState('https://architects.onrender.com')
  const [endpoint, setEndpoint] = useState('http://localhost:5000');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [errorOnForm, setErrorOnForm] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const formInitialsDetail = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    message: '',
    destnationEmail: 'thomas.kitaba@gmail.com'
  }

  const [form, setForm] = useState(formInitialsDetail);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});
  const [screenSize, setScreenSize] = useState(window.innerWidth);

// get the width of the screen
useEffect(() => {
  const handleResize = () => setScreenSize(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  }
}, [screenSize]);

const onFormUpdate = (formField, value) => {
  setForm({
    ...form,
    [formField]: value
  })
}

const validateForm = (form) => {
  const fname = checkTextExist(form.fname);
  const lname = checkTextExist(form.lname);
  const email = checkEmail(form.email);
  const phone = checkPhone(form.phone);
  const message = checkTextExist(form.message);
  // alert(`fname:${fname} | lname:${lname} | email:${email} | phone: ${phone} | message: ${message}`);
  if (fname === true && lname === true && email === true && phone === true && message === true) {
    setFormValidated(true);
    return (true);
  }
  let formError = [];
    !fname && formError.push("First Name");
    !lname && formError.push('Last Name');
    !email && formError.push('Email');
    !phone && formError.push('Phone');
    !message && formError.push('Message')
  const tempMessage = formError.join(', ');
    setMessageText(`Check :- ${formError.join(', ')}`);
  return (false);
}

const sendTestEmail  = async (e) => {
  e.preventDefault();
  // TODO: validate form
  console.log('validating contact form');
  const formValidated = validateForm(form);


  if (formValidated === true) {
    setButtonText('Sending ...');
    const mailType = 'contact';
    // setUserId(userId);
    const destnationEmail = 'thomas.kitaba.diary@gmail.com';
    try {
      const response = await axios.post(
        `${endpoint}/api/sendemail`, // Update the URL to HTTPS
        { userId, mailType, destnationEmail, form },
        {
          headers: {
            'Content-type': 'application/json',
            'x-api-key': myApiKey,
          },
        }
      );
      setButtonText('Send');
      setForm(formInitialsDetail);

      setMessageText('Message Submited Successfully');
      setShowMessage(true);
      // console.log('Response:', response.data);
      // alert('success');

    } catch (error) {
      console.error('Error sending email:', error);
      // alert('Email not sent. Check console for error det
      setButtonText('Send');
    }
  } else {
    console.log('Form Invalid');

    setButtonText('Send');
    setErrorOnForm(true);
    setShowMessage(true);
    // alert(messageText);
  }
};

return (
  <>
   {showMessage && (
        <div className="user-message-container" style={errorOnForm ? { color: 'red'} : {color: 'green'}}>
          <div className="user-messsage-title-bar">

            <X className="user-message-close" onClick={(e) => {setShowMessage(false); setErrorOnForm(false); setFormValidated(false)}} /> {/* Assuming X is a component for closing the message */}
          </div>
          <div className="user-message-content">
            <span>{messageText}</span>

          </div>
        </div>
      )}
  <section className="contact" id="connect">
    <div className="contact-header">  <div id='contact-header'>Let's Connect</div> </div>
    <Container>
      <Row className="align-items-center">
        <Col md={6}>
          {/* {screenSize > 768 ? <img src={Chief} alt="Contact image Chief standing" /> : <img src={Chief2} alt="Contact image Chief standing" />} */}
          <div className='contact-paragraph'>
            <h3>Our team of experienced consultants can assist you with:</h3>
          <div className='contact-paragraph-list'>
            <ul>
              <li>Education planning and strategy</li>
              <li>Curriculum development</li>
              <li>Teaching methodologies</li>
              <li>Student assessments</li>
              <li>Education technology integration</li>
              <li>And much more!</li>
            </ul>
          </div>
          <div className="contact-paragraph-footer">
            <p>Feel free to reach out to us using the contact form below. We're passionate about education and look forward to helping you achieve your goals.</p>
          </div>
          </div>
        </Col>
        <Col>
          <form >
            <Row className="mx-1">
              <Col className="px-1">
                <input type="text" placeholder="First Name" name="fname" value={form.fname} onChange={ (e) => onFormUpdate('fname', e.target.value)} />
              </Col>
              <Col className="px-1">
                <input type="text" placeholder="Last Name" name="lname" value={form.lname} onChange={ (e) => onFormUpdate('lname', e.target.value)} />
              </Col>
            </Row>
            <Row className="mx-1">
              <Col className="px-1">
                <input type="email" placeholder="Email" name="email" value={form.email} onChange={ (e) => onFormUpdate('email', e.target.value)} />
                <input type="tel" value={form.phone} name="phone" placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)}/>
                <textarea placeholder="Message" name="messge" value={form.message} onChange={ (e) => onFormUpdate('message', e.target.value)} />
              </Col>
            </Row >
            <Row className="mx-1">
              <Col md={4} sm={4} className="px-1">
                <button type="submit" onClick={(e) => {e.preventDefault(); sendTestEmail(e);}}><span>{buttonText}</span></button>
              </Col>
              {
                  status.message &&
                  <Col className="px-1">
                    <p className={status.success === true ? "sucess" : "danger"}></p>
                  </Col>
              }
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  </section>
  </>
)
}

export default Contact;
