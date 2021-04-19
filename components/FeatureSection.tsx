import { keyframes } from "@emotion/react";
import Reveal from "react-awesome-reveal";

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

type FeatureSectionProps = { title: string, img: string, alt: string, children: any }
export default function FeatureSection({ title, img, alt, children }: FeatureSectionProps) {
  return (
    <div className="py-2 bg-white">
      <Reveal triggerOnce={true} keyframes={customAnimation}>
        <div className="flex-row lg:flex">
          <div className="relative px-4 py-6 overflow-hidden sm:px-6 sm:py-8 lg:p-8 xl:p-16">
            <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-blue-900 sm:text-4xl sm:leading-10">
              {title}
            </h3>
            <ul className="pt-5 list-disc pl-4 leading-8 italic">
              {children}
            </ul>
          </div>
          <div className="py-16 px-4">
            <img
              src={img}
              alt={alt}
              className="shadow-2xl"
              style={{ maxWidth: '700px' }}
            />
          </div>
        </div>
      </Reveal>
    </div>
  )
}

type FeatureBlackSectionProps = { title: string, img: string, alt: string, children: any }
export function FeatureBlackSection({ title, img, alt, children }: FeatureBlackSectionProps) {
  return (
    <div className="py-2 bg-gray-800 signal background">
      <Reveal triggerOnce={true} keyframes={customAnimation}>
      <div className="flex-row-reverse lg:flex">
          <div className="relative px-4 py-6 overflow-hidden sm:px-6 sm:py-8 lg:p-8 xl:p-16">
            <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-200 sm:text-4xl sm:leading-10">{title}</h3>
            <ul className="pt-5 list-disc pl-4 leading-8 italic text-gray-400">
              {children}
            </ul>
          </div>
          <div className="py-16 px-4">
            <img
              src={img}
              alt={alt}
              className="shadow-2xl"
              style={{ maxWidth: "700px" }} />
          </div>
        </div>
      </Reveal>
    </div>
  )
}