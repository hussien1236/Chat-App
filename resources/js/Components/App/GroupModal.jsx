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

const GroupModal = ({show = false, onClose = ()=>{}}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const {on, emit} = useEventBus();
    const [group, setGroup] = useState({});

    const {data, setData, processing, reset, post, put, errors} = useForm({
        id: '',
        name: '',
        description: '',
        user_ids: [],
    });
    const users = conversations.filter(c => !c.is_group);
    const createOrUpdateGroup = (e) => {
        e.preventDefault();
        if(group.id){
            put(route('group.update', group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group ${data.name} was updated successfully`);
                }
            });
            return;
        } 
        post(route('group.store'), {
            onSuccess: () => {
                closeModal();
                emit("toast.show", `Group ${data.name} was created successfully`);
            }
        });
    };
    const closeModal = () => {
        reset();
        onClose();
    }
    useEffect(() => {
        return on("GroupModal.show", (group) => {
      setData({
        name: group?.name || '',
        description: group?.description || '',
        user_ids: group?.users?.map(u => u.id) || [],
      });
        setGroup(group);
    })}, [on]);
  return (
    <Modal show={show} onClose={closeModal}>
        <form onSubmit={createOrUpdateGroup} className='space-y-6 overflow-y-auto p-5'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 text-center'>
                {group.id ? `Edit Group ${group.name}` : 'Create New Group'}
            </h2>
            <div className='mt-8'>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput id="name" className="mt-1 block w-full"
                value={data.name} disabled={!!group.id}
                onChange={(e)=> setData("name", e.target.value)}
                required isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className='mt-4'>
                <InputLabel htmlFor="description" value="Description" />
                <TextAreaInput id="description" className="mt-1 block w-full"
                value={data.description || ''} onChange={(e)=> setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div className='mt-4'>
                <InputLabel value="Add Members" />
                <UserPicker
                value={users.filter(u => group.owner_id != u.id && data.user_ids.includes(u.id)) || []}
                options={users}
                onSelect={(users) => {
                    setData('user_ids', users.map(s => s.id));
                }}
                />
                <InputError message={errors.user_ids} className="mt-2" />
            </div>
            <div className='mt-6 flex justify-end'>
                <SecondaryButton onClick={closeModal} className="mr-3">
                    Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {group.id ? 'Update Group' : 'Create Group'}
                </PrimaryButton>
            </div>
        </form>
    </Modal>
)
}

export default GroupModal