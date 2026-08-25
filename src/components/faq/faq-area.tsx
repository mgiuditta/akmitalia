"use client";
import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

const faqItems: FAQItem[] = [
  {
    id: "collapseOne",
    question: "Bring their individual experience and creative?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
  {
    id: "collapseTwo",
    question: "Design should enrich our day?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: true,
  },
  {
    id: "collapseThree",
    question: "Human centered design to challenges design theory?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
  {
    id: "collapseFour",
    question: "Align with your brand look and feel?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
  {
    id: "collapseFive",
    question: "How to become an Agile productive manager?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
  {
    id: "collapseSix",
    question: "Why we create the best Webflow websites in Figma?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
  {
    id: "collapseSeven",
    question: "How to manage Agile project teams?",
    answer:
      "People know what an FAQ is, so make that your page title. Don’t overcomplicate things by calling it “Good to Know” or “More Info”. Sometimes people put the frequently asked questions section on their Contact page, but you can create your own page and put it right in your website navigation menu",
    isOpen: false,
  },
];

export const AccordionWrapper = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(faqItems);

  const toggleFAQ = (id: string) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq) =>
        faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false }
      )
    );
  };
  return (
    <div className="accordion-wrapper fade-anim">
      <div className="accordion" id="accordionExample">
        {faqs.map((faq) => (
          <div key={faq.id} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${faq.isOpen ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={faq.isOpen}
                aria-controls={faq.id}
              >
                {faq.question}
              </button>
            </h2>
            <div
              id={faq.id}
              className={`accordion-collapse collapse ${faq.isOpen ? 'show' : ''}`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FAQArea = () => {

  return (
    <section className="faq-area">
      <div className="container large">
        <div className="faq-area-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">FAQ</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Learn some common answers about newly projects
                </h2>
              </div>
            </div>
          </div>

          {/* accordion wrapper */}
          <AccordionWrapper />
          {/* accordion wrapper */}

        </div>
      </div>
    </section>
  );
};

export default FAQArea;