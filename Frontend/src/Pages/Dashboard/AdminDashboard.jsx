import React, { useEffect } from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, plugins } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteCourse, getAllCourses } from '../../Redux/Slices/CourseSlice'
import { getStatsData } from '../../Redux/Slices/StatSlice'
import { getPaymentRecord } from '../../Redux/Slices/RazorpaySlice'
import { FaUsers } from "react-icons/fa"
import { FcSalesPerformance } from "react-icons/fc"
import { GiMoneyStack } from "react-icons/gi"
import { BsCollectionPlay, BsTrash } from 'react-icons/bs'

ChartJs.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip)

function AdminDashboard() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUseraccount, subscribedUsersCount } = useSelector((state) => state.stat);
  // console.log("Redux state: ",{allUseraccount, subscribedUsersCount });
  const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    datasets: [
      {
        label: "User Details",
        fontColor: "white",
        data: [allUseraccount||0, subscribedUsersCount||0],
        backgroundColor: ["yellow", "green"],
        borderWidth: 1,
        borderColor: ["yellow", "green"]
      }
    ]
  };

  // console.log("User data",userData); //debug

  const SalesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dev"],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: ["rgb(255,99,132)"],
        borderColor: ["white"],
        borderWidth: 2
      }
    ]
  };

  const myCourses = useSelector((state) => state?.course?.courseData);

  async function onCourseDelete(id) {
    if (window.confirm("Are you sure to Delete the course?")) {
      const res = await dispatch(deleteCourse(id));
      // console.log("Response",res);
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  }

  useEffect(() => {
    (
      async () => {
        await dispatch(getAllCourses());
        await dispatch(getStatsData());
        await dispatch(getPaymentRecord());
      }
    )();
  }, [])

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
        <h1 className='text-center text-5xl font-semibold text-yellow-500'>
          Admin Dashboard
          </h1>

        <div className="grid grid-cols-2 m-auto mx-10">
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">

            <div className="w-80 h-80">
              <Pie data={userData}/>
            </div>
            <div className="grid grid-cols-2 gap-5">

              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className='font-semibold'>Registered Users</p>
                  <h3 className='text-4xl font-bold'>{allUseraccount}</h3>
                </div>
                <FaUsers className="text-yellow-500 text-5xl" />
              </div>
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className='font-semibold'>Subscribed Users</p>
                  <h3 className='text-4xl font-bold'>{subscribedUsersCount}</h3>
                </div>
                <FaUsers className="text-green-500 text-5xl" />
              </div>

            </div>
          </div>

          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="h-80 w-full relative">
              <Bar data={SalesData} className='absolute bottom-0 h-80 w-full ' />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className='font-semibold'>Subscription Count</p>
                  <h3 className='text-4xl font-bold'>{allPayments?.count}</h3>
                </div>
                <FcSalesPerformance className="text-yellow-500 text-5xl" />
              </div>
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className='font-semibold'>Total Revenue </p>
                  <h3 className='text-4xl font-bold'>{allPayments?.count * 499}</h3>
                </div>
                <GiMoneyStack className="text-yellow-500 text-5xl" />
              </div>

            </div>
          </div>
        </div>

        <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 ">
          <div className="flex w-full items-center justify-between">
            <h1 className='text-center text-3xl font-semibold'>Courses Overview</h1>

            <button
              onClick={() => navigate('/course/create',)}
              className='w-fit bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ease-in-out rounded py-2 px-4 font-semibold cursor-pointer'
            >
              Create New Course
            </button>
          </div>

          <table className='table overflow-x-scroll '>
            <thead>
              <tr>
                <th>S No</th>
                <th>Course Title</th>
                <th>Course Category</th>
                <th>Instructor</th>
                <th>Total Lectures</th>
                <th>Descriptions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses?.map((course, idx) => {
                return (
                  <tr key={course._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <textarea readOnly value={course?.title} className='w-40 h-auto bg-transparent resize-none'></textarea>
                    </td>
                    <td>
                      {course?.category}
                    </td>
                    <td>{course?.createdBy}</td>
                    <td>{course?.numberOfLectures}</td>
                    <td className='max-w-28 overflow-hidden text-ellipsis whitespace-nowrap'>
                      <textarea readOnly value={course?.description} className='w-80 h-auto bg-transparent resize-none'></textarea>
                    </td>
                    <td className='flex items-center gap-4'>
                      <button
                        onClick={() => navigate('/course/displaylecture', { state: { ...course } })}
                        className='bg-green-500 hover:bg-green-600 transition-all duration-300 ease-in-out text-xl py-2 px-4 rounded-md font-bold'
                      >
                        <BsCollectionPlay />
                      </button>
                      <button
                        onClick={() => onCourseDelete(course?._id)}
                        className='bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in-out text-xl py-2 px-4 rounded-md font-bold'
                      >
                        <BsTrash />
                      </button>

                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  )
}

export default AdminDashboard