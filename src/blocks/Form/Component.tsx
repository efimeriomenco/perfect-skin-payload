'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { useTranslations } from 'next-intl'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  title?: string
  subtitle?: string
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    title,
    subtitle,
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()
  const t = useTranslations()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="py-8 md:py-16 md:px-8">
      <div className="max-w-lg mx-auto px-4 md:px-0">
        {/* Title & Subtitle - hidden after submission */}
        {!hasSubmitted && (title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-urbanist">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-sm md:text-base text-white/80">{subtitle}</p>
            )}
          </div>
        )}

        <FormProvider {...formMethods}>
          {enableIntro && introContent && !hasSubmitted && (
            <RichText className="mb-8 text-white" content={introContent} enableGutter={false} />
          )}
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <div className="text-center py-8 mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {confirmationMessage && (
                <p className="text-white/90 text-xl lg:text-2xl whitespace-pre-line font-urbanist">{confirmationMessage}</p>
              )}
            </div>
          )}
          {isLoading && !hasSubmitted && <p className="text-white">{t('loading')}</p>}
          {error && (
            <div className="text-red-300">{`${error.status || '500'}: ${error.message || ''}`}</div>
          )}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0 flex flex-col md:flex-row md:flex-wrap gap-4 [&_input]:bg-white [&_input]:rounded-md [&_input]:h-11 [&_input]:border-0 [&_textarea]:bg-white [&_textarea]:rounded-md [&_textarea]:border-0">
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    const Field: React.FC<any> = fields?.[field.blockType]
                    if (Field) {
                      // Get field width from admin config, default to 100 for full width
                      const fieldWidth = (field as any).width || 100

                      // Force full width for certain field types
                      const forceFullWidth =
                        field.blockType === 'textarea' ||
                        field.blockType === 'checkbox'

                      const width = forceFullWidth ? 100 : fieldWidth

                      return (
                        <div
                          key={index}
                          className="min-w-0 w-full md:w-auto"
                          style={{
                            ...(width === 100 ? {
                              flexBasis: '100%',
                              flexGrow: 1,
                            } : {
                              flexBasis: `calc(${width}% - 0.5rem)`,
                              flexGrow: 0,
                              flexShrink: 0,
                            })
                          }}
                        >
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              <Button
                form={formID}
                type="submit"
                variant="default"
                className="w-full mt-2 h-11 rounded-md bg-black hover:bg-[#2C2C2C] text-white text-sm font-medium"
              >
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
