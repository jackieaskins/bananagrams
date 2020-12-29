import { Alert, Form as AntForm, Space } from 'antd';
import { FormProps as AntFormProps } from 'antd/lib/form';
import { ReactNode, useMemo, useState } from 'react';

import { SetState } from '../state/types';

export type SubmitFormFn<FormValues> = (
  setError: SetState<string>
) => (values: FormValues) => void;

export interface FormProps<FormValues> extends AntFormProps<FormValues> {
  children: ReactNode;
  onSubmit: SubmitFormFn<FormValues>;
  initialValues?: Partial<FormValues>;
}

const Form = <FormValues,>({
  children,
  initialValues,
  onSubmit,
  ...rest
}: FormProps<FormValues>): JSX.Element => {
  const [error, setError] = useState('');

  const handleSubmit = useMemo(() => onSubmit(setError), [onSubmit, setError]);

  return (
    <AntForm
      initialValues={initialValues}
      onFinish={handleSubmit}
      scrollToFirstError
      validateMessages={{ required: 'Required' }}
      labelAlign="left"
      {...rest}
    >
      <Space direction="vertical" css={{ width: '100%' }} size="large">
        {error && <Alert type="error" message={error} />}

        <div>{children}</div>
      </Space>
    </AntForm>
  );
};

export default Form;
