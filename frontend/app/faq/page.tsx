"use client"
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";
import LoadableContainer from "@/components/loadableContainer";
import { FAQItem } from "@/lib/types";

// Define the FAQ item type

// Define the API response type
interface APIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQItem[];
}

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async (): Promise<void> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/`);
        if (!response.ok) throw new Error("Failed to fetch FAQs");
        const data: APIResponse = await response.json();
        setFaqs(data.results);
      } catch (err) {
        setError("Błąd podczas pobierania FAQ.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  if (isLoading) return <LoadableContainer>Ładowanie...</LoadableContainer>;
  if (error) return <LoadableContainer>{error}</LoadableContainer>;

  return (
    <div className="container mx-auto p-2 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Często Zadawane Pytania</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem key={faq.id} value={`item-${index}`}>
            <AccordionTrigger className="text-xl font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-4" dangerouslySetInnerHTML={{ __html: faq.answer }} />
              {(faq.url1 || faq.url2) && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Przydatne linki:</h3>
                  <ul className="list-disc list-inside">
                    {faq.url1 && (
                      <li>
                        <a
                          href={faq.url1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Link 1
                        </a>
                      </li>
                    )}
                    {faq.url2 && (
                      <li>
                        <a
                          href={faq.url2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Link 2
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQPage;