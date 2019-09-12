import React, { useState, useEffect } from 'react'
import { withFormik, Form, Field } from 'formik'
import * as yup from 'yup'
import axios from 'axios'


const AnimalForm = ({errors, touched, status}) => {
  const [animals, setAnimals] = useState([])

  useEffect(() => {
    if (status) {
      setAnimals([ ...animals, status ])
    }
  }, [status])

  return (
    <Form>
      {touched.species && errors.species && <p className='error'>{errors.species}</p>}
      <Field type="text" name="species" placeholder="Species" />
      {touched.age && errors.age && <p className='error'>{errors.age}</p>}
      <Field type='number' name='age' placeholder='Age' />
      {touched.diet && errors.diet && <p className='error'>{errors.diet}</p>}
      <Field name='diet' component="select">
        <option value='' disabled>Select Diet:</option>
        <option name='carnivore'>Carnivore</option>
        <option name='herbivore'>Herbivore</option>
        <option name='omnivore'>Omnivore</option>
      </Field>
      {touched.vaccinations && errors.vaccinations && <p className='error'>{errors.vaccinations}</p>}
      <label>
        <Field type='checkbox' name='vaccinations' />
        <span>Vaccinated</span>
      </label>

      <Field component='textarea' name='notes' placeholder='Notes' />
      <button type="submit">Submit</button>

    {animals.map((animals) => (
      <div>Species: {animals.species}</div>
    ))}

    </Form>
  )
}

export default withFormik({
  mapPropsToValues: (values) => {
    return {
      species: values.species || '',
      age: values.age || '',
      diet: values.diet || '',
      checkbox: values.checkbox || false,
      notes: values.notes || '',
    }
  },
  validationSchema: yup.object().shape({
    species: yup.string().required("Species is required"),
    age: yup.number().required("Age is required").positive(),
    diet: yup.string().required("Diet is required"),
    vaccinations: yup.boolean().oneOf([true], "Animal Must be Vaccinated!")
  }),
  handleSubmit: (values, { setStatus }) => {
    // https://reqres.in/api/animals
    axios.post('https://reqres.in/api/animals', values)
    .then(res => {
      setStatus(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }
})(AnimalForm)

