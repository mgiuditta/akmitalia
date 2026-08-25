"use client";
import { FormEvent, useState } from "react";

export default function ContactArea() {
  const [budget, setBudget] = useState("");

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  return (
    <section className="contact-area-contact-page">
      <div className="container large">
        <div className="contact-area-contact-page-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Contact</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Let’s drop us a line and get the project started.
                </h2>
              </div>
            </div>
          </div>
          <div className="section-content-wrapper fade-anim">
            <div className="section-content">
              <div className="contact-mail">
                <p className="title">Get in touch</p>
                <p className="text">
                  We’re excited to hear from you and let’s start something
                  special together <br />
                  <a href="mailTo:hello@redoxagency.com">
                    hello@redoxagency.com
                  </a>
                </p>
              </div>
              <div className="contact-social">
                <p className="title">Follow</p>
                <div className="social-links">
                  <a href="#">Facebook</a>
                  <a href="#">Twitter</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">Instagram</a>
                  <a href="#">Dribbble</a>
                  <a href="#">Behance</a>
                </div>
              </div>
            </div>
            <div className="contact-wrap">
              <form onSubmit={handleSubmit} id="contact__form">
                <div className="contact-formwrap">
                  <div className="contact-formfield">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name*"
                    />
                  </div>
                  <div className="contact-formfield">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email*"
                    />
                  </div>
                  <div className="contact-formfield">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Phone*"
                    />
                  </div>
                  <div className="contact-formfield">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      placeholder="Company"
                    />
                  </div>
                  <div className="contact-formfield">
                    <select
                      name="Budget"
                      id="Budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="" disabled>
                        Budget*
                      </option>
                      <option value="1">5,000 - 10,000</option>
                      <option value="2">10,000 - 15,000</option>
                      <option value="3">15,000 - 20,000</option>
                      <option value="4">20,000 - 25,000</option>
                      <option value="5">25,000 - Above</option>
                    </select>
                  </div>
                  <div className="contact-formfield">
                    <input
                      type="text"
                      name="solution"
                      id="solution"
                      placeholder="Solution*"
                    />
                  </div>
                  <div className="contact-formfield message">
                    <input
                      type="text"
                      name="message"
                      id="message"
                      placeholder="Message*"
                    />
                  </div>
                </div>
                <div className="submit-btn">
                  <button type="submit" className="rr-btn">
                    <span className="btn-wrap">
                      <span className="text-one">Send Message</span>
                      <span className="text-two">Send Message</span>
                    </span>
                  </button>
                </div>
                <div id="response-message"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
