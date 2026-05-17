import { CheckIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProgressSteps({ steps }) {
  return (
    <nav aria-label="Progress" className="hidden lg:block">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? 'pb-25' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="absolute top-4 left-4 mt-0.5 -ml-px h-full w-0.5 bg-indigo-600 dark:bg-indigo-500"
                  />
                ) : null}
                <Link
                  to={step.href}
                  className="group relative flex items-start"
                >
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-700 dark:bg-indigo-500 dark:group-hover:bg-indigo-600">
                      <CheckIcon
                        aria-hidden="true"
                        className="size-5 text-white"
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </Link>
              </>
            ) : step.status === 'current' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="absolute top-4 left-4 mt-0.5 -ml-px h-full w-0.5 bg-gray-300 dark:bg-gray-700"
                  />
                ) : null}
                <Link
                  to={step.href}
                  aria-current="step"
                  className="group relative flex items-start"
                >
                  <span aria-hidden="true" className="flex h-9 items-center">
                    <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-950 dark:border-indigo-500 dark:bg-gray-900">
                      <span className="size-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </Link>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="absolute top-4 left-4 mt-0.5 -ml-px h-full w-0.5 bg-gray-300 dark:bg-white/15"
                  />
                ) : null}
                <Link
                  to={step.href}
                  className="group relative flex items-start"
                >
                  <span aria-hidden="true" className="flex h-9 items-center">
                    <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-indigo-950 group-hover:border-gray-400 dark:border-white/15 dark:bg-gray-900 dark:group-hover:border-white/25">
                      <span className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-white/15" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </Link>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
