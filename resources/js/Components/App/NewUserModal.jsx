import { useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import Modal from '../Modal';
import SecondaryButton from '../SecondaryButton';
import PrimaryButton from '../PrimaryButton';
import InputLabel from '../InputLabel';
import InputError from '../InputError';
import { useEventBus } from '@/EventBus';
import TextInput from '../TextInput';
import TextAreaInput from '../TextAreaInput';
import UserPicker from './UserPicker';
import Checkbox from '../Checkbox';

const NewUserModal = ({show = false, onClose = ()=>{}}) => {
    const {emit} = useEventBus();

    const {data, setData, processing, reset, post, errors} = useForm({
        name: '',
        email: '',
        is_admin: false,
    });
    const submit = (e) => {
        e.preventDefault();
      
        post(route('user.store'), {
            onSuccess: () => {
                closeModal();
                emit("toast.show", `User ${data.name} was created successfully`);
            }
        });
    };
    const closeModal = () => {
        reset();
        onClose();
    }
  return (
    <Modal show={show} onClose={closeModal}>
        <form onSubmit={submit} className='space-y-6 overflow-y-auto p-5'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 text-center'>
                Create New User
            </h2>
            <div className='mt-8'>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput id="name"
                className="mt-1 block w-full"
                value={data.name} 
                onChange={(e)=> setData("name", e.target.value)}
                required isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className='mt-4'>
                <InputLabel htmlFor="email" value="Email" />
                 <TextInput id="email"
                className="mt-1 block w-full"
                value={data.email} 
                onChange={(e)=> setData("email", e.target.value)}
                required 
                />
                <InputError message={errors.email} className="mt-2" />
            </div>
            <div className='mt-4'>
                <label className='flex items-center'>
                <Checkbox
                name="is_admin" 
                checked={data.is_admin}
                onChange={(e)=> setData("is_admin", e.target.checked)}
                />
                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                    Admin User
                </span>
                <InputError message={errors.is_admin} className="mt-2" />
                </label>
            </div>
            <div className='mt-6 flex justify-end'>
                <SecondaryButton onClick={closeModal} className="mr-3">
                    Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    Create
                </PrimaryButton>
            </div>
        </form>
    </Modal>
)
}

export default NewUserModal