import React, { Component } from 'react';
import axios from 'axios';

class AddPlace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        state: '',
        type_water_object: '',
        name_water_object: '',
        name_place: '',
        longitude: '',
        latitude: '',
        comment: ''
      },
      errors: [],
      success: ''
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/add_place', this.state.formData);
      const { data } = response;

      if (data.error_box && data.error_box.length > 0) {
        this.setState({ errors: data.error_box, success: '' });
      } else if (data.success) {
        this.setState({
          success: data.success,
          formData: {
            type_water_object: '',
            name_water_object: '',
            state,
            name_place: '',
            longitude: '',
            latitude: '',
            comment: ''
          },
          errors: []
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({
        errors: [{ msg: 'Something went wrong on the server side' }],
        success: ''
      });
    }
  };

  render() {
    const { formData, errors, success } = this.state;

    return (
      <div>
        {/* Відображення помилок, якщо є */}
        {errors.map((error, index) => (
          <div key={index}>{error.msg}</div>
        ))}

        {/* Відображення повідомлення успіху, якщо є */}
        {success && <div>{success}</div>}

        {/* Форма для введення даних */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="type_water_object"
            value={formData.type_water_object}
            onChange={this.handleChange}
            placeholder="Type water object"
          />
          <input
            type="text"
            name="name_water_object"
            value={formData.name_water_object}
            onChange={this.handleChange}
            placeholder="Name water object"
          />
          <input
            type="text"
            name="name_place"
            value={formData.name_place}
            onChange={this.handleChange}
            placeholder="Name place"
          />
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={this.handleChange}
            placeholder="Coordinate x"
          />
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={this.handleChange}
            placeholder="Coordinate y"
          />
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={this.handleChange}
            placeholder="Comment"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default AddPlace;