import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




class Popup extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      descr : '',
      priority : '1',
      status : '1',
      planeDate : new Date(),
    };
  }
  handleSubmit(){

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  render() {
    const newDate = new Date();
    const separator = '-';
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    const nowDate = `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`;

    let status;
      if (!this.props.isNew){
        status = (
          <select name="status" id="popup-form__status" value={this.state.status} onChange={this.handleInputChange} >
            <option value="1" selected>Новая</option>
            <option value="2">В работе</option>
            <option value="3">Завершена</option>
          </select>
        );
      } else{
       status = (
          <select name="status" id="popup-form__status" value={this.state.status} onChange={this.handleInputChange} >
           <option value="1" selected>Новая</option>
           </select>
       );
      }
    return (
      <div id="popup" className='popup'>
        <div class="popup-wrap">
        <button onClick={this.props.closePopup} className="popup-close">Закрыть</button>
        <h2>Создание/редактирование задачи</h2>
        <form onSubmit={this.handleSubmit} className="popup-form">
        <div className="popup-form-wrap">
          <label for="popup-form__descr">Описание</label>
          <input 
            id="popup-form__descr" 
            name="descr" 
            type="text" 
            required="true"
            value={this.state.descr}
            onChange={this.handleInputChange} 
            ></input>
        </div>
        <div className="popup-form-wrap">
            <label for="popup-form__priority">Приоритет</label>
          <select name="priority" id="popup-form__priority" value={this.state.priority} onChange={this.handleInputChange}>
            <option value="1" selected>Низкий</option>
            <option value="2">Средний</option>
            <option value="3">Высокий</option>
          </select>
        </div>
        <div className="popup-form-wrap">
            <label for="popup-form__status">Статус</label>
          {status}
        </div>
        <div className="popup-form-wrap">
            <label for="popup-form__plan">Планируемая дата окончания</label>
            <input id="popup-form__plan" name="planeDate" type="date" required=""
             value={nowDate} onChange={this.handleInputChange}/>
          </div>
          <button type="submit">Сохранить</button>
      </form>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showPopup: false,
      tasks: [
        {
          descr: 'task 1',
          priority: 1,
          status: 1,
          planeDate: '28.02.2020', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        },
        {
          descr: 'task 2',
          priority: 2,
          status: 1,
          planeDate: '28.02.2020', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        },
        {
          descr: 'task 3',
          priority: 1,
          status: 2,
          planeDate: '28.02.2020', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        },
      ]
    }
  }


  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }


  render() {
    const tasks = this.state.tasks;
    const list = tasks.map((task, num) => {
      //если дата в DateFormat
      // const planeDateInFormat = 
      //           task.planeDate.getDate() + 
      //           "." + (+task.planeDate.getMonth()+1) +
      //           "." + task.planeDate.getFullYear();
      return (
        <tr>
            <td>{task.descr}</td>
            <td>{task.status}</td>
            <td>{task.priority}</td>
            <td>{task.planeDate}</td>
            <td>{task.factDate}</td>
            <td><button className="remove" onClick={() => this.removeTask(num)}>Удалить</button></td>
        </tr>
      );
    })
    return (
      <div className="app">
        {this.state.showPopup ? 
            <Popup
                isNew={true}
                closePopup={this.togglePopup.bind(this)}
            />
            : null
        }
        <h1>CRUD Задачи</h1>
        <div className="tools">
          <button className="assTask" onClick={() => this.togglePopup()}>Добавить задачу</button>
          <form className="findTask-form">
            <input type="text" className="findTask__input" placeholder="Описание задачи"/>
            <button className="findTask__btn">Поиск</button>
          </form>

          <div className="filters">
            <button className="filter-all active">
              Всего - 4
            </button>
            <button className="filter-news">
              Новых - 4
            </button>
            <button className="filter-is">
              В работе - 4
            </button>
            <button className="filter-complete">
              Завершено - 4
            </button>
          </div>
        </div> 
        <table>
          <thead>
            <tr>
              <td>Описание</td>
              <td>Статус</td>
              <td>Приоритет</td>
              <td>Плановая дата окончания</td>
              <td>Фактическая дата окончания</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
              {list}
          </tbody>
        </table>
      </div>

    );
  }
}

// ========================================


ReactDOM.render(

  <App />,
  document.getElementById('root')
);
