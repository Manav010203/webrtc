"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const router = useRouter()
    const [meeting , setMeeting]= useState<'isSchedulingMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const {user} = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
      dateTime: new Date(),
      description: '',
      link:''
    })
    const [callDetails, setcallDetails]= useState<Call>()

    const { toast } = useToast()
    const meetingLink= `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    const createMeeting =async ()=>{
      if(!client || !user) return ;
      try{
        if(!values.dateTime){
          toast({
            title: "Please select a date &time",
          })
          return
        }
        const id =crypto.randomUUID()
        const call = client.call('default',id)

        if(!call) throw new Error ("failed call");

        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant meeting';

        await call.getOrCreate({
          data:{
            starts_at: startsAt,
            custom: {
              description
            }
          }
        })
        setcallDetails(call)

        if(!values.description){
          router.push(`/meeting/${call.id}`)
        }
        toast({
          title: "meeting created",
        })
      }catch(e){
        console.log(e);
        toast({
          title: "failed to create a meeting",
        })
      }
    }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
     <HomeCard 
     img="/icons/add-meeting.svg"
     title="New Meeting"
     description="Start an instant meeting"
     handleClick= {()=> setMeeting('isInstantMeeting')}
     className="bg-orange-1 "/>
     <HomeCard img="/icons/join-meeting.svg"
     title="Join Meeting"
     description="Join via invitation link"
     handleClick= {()=> setMeeting('isJoiningMeeting')}
     className="bg-yellow-1 "/>
     <HomeCard img="/icons/schedule.svg"
     title="Schedule Meeting"
     description="Plan your meeting"
     handleClick= {()=> setMeeting('isSchedulingMeeting')}
     className="bg-blue-1 "/>
     <HomeCard img="/icons/recordings.svg"
     title="View Recordings"
     description="Check out your recordings"
     handleClick= {()=> router.push('/recordings')}
     className="bg-purple-1 "/>
{!callDetails ? (
  <MeetingModel
  isOpen ={meeting === 'isSchedulingMeeting'}
  onClose= {()=> setMeeting(undefined)}
  title = "create an Meeting"
  
  handleClick={createMeeting}
     >
      <div className='flex flex-col gap-2.5'>
        <label className='text-base text-normal leading-[22px] text-sky-2'>
          Add a Description
        </label>
        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' 
        onChange={(e)=>{
          setValues({...values, description: e.target.value})
        }}/>
      </div>
      <div className='flex w-full flex-col gap-2.5'>
        <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
        
        <ReactDatePicker 
        selected={values.dateTime}
        onChange={(date)=>
          setValues({...values,dateTime:date!})
        }
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        timeCaption='time'
        dateFormat="MMMM d, yyyy h:mm aa"
        className='w-full rounded bg-dark-3 p-2 focus:outline-none'
        />
      </div>
     </MeetingModel>
  
):(
  <MeetingModel 
     isOpen ={meeting === 'isSchedulingMeeting'}
     onClose= {()=> setMeeting(undefined)}
     title = "Meeting Created"
     className="text-center"
     handleClick={()=>{
      navigator.clipboard.writeText(meetingLink)
      toast({ title: 'Link copied'})
     }}
     image='/icons/checked.svg'
     buttonIcon='/icons/copy.svg'
     buttonText = 'Copy meeting link'/>
)}
     <MeetingModel 
     isOpen ={meeting === 'isInstantMeeting'}
     onClose= {()=> setMeeting(undefined)}
     title = "Start an Instant Meeting"
     className="text-center"
     buttonText="Start Meeting"
     handleClick={createMeeting}
        />
        <MeetingModel 
     isOpen ={meeting === 'isJoiningMeeting'}
     onClose= {()=> setMeeting(undefined)}
     title = "Type the link here"
     className="text-center"
     buttonText="Join Meeting"
     handleClick={()=>router.push(values.link)}
        >
          <Input placeholder='Meeting link'
          className='border-none bg-dark-3 focus-visible:ring-0
          focus-visible:ring-offset-0' 
          onChange={(e)=>setValues({...values, link:e.target.value})}/>
        </MeetingModel>
     
    </section>
  )
}

export default MeetingTypeList
MeetingTypeList