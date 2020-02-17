import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Popup extends React.Component {
  constructor (props){
    super(props);
    const newDate = new Date();
    const separator = '-';
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    const nowDate = `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`;

    this.state = {
      task: {
        descr : '',
        priority : '1',
        status : '1',
        planeDate : nowDate,
        factDate: '',
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.handleSubmit(this.state.task)   
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let task = this.state.task;
    task[name] = value;

    this.setState({
      task : task,
    });
  }

  componentWillMount(){
    let task;
    if (typeof this.props.task != 'undefined'){
      task = this.props.task;
      this.setState({
        task : task,
      });
    }
  }
  render() {
    //title
    const title = (typeof this.props.task == 'undefined'?'Создание задачи':'Редактирование задачи');
    //priority
    let priority;
      priority = (
        <select name="priority" id="popup-form__priority" value={this.state.task.priority} onChange={this.handleChange}>
          <option value="1">Низкий</option>
          <option value="2">Средний</option>
          <option value="3">Высокий</option>
        </select>
      );
    //status
    let status;
    if (typeof this.props.task == 'undefined'){
      status = (
        <select name="status" id="popup-form__status" value={this.state.task.status} onChange={this.handleChange} >
         <option value="1" selected>Новая</option>
        </select>
      );
    } else{
     status = (
      <select name="status" id="popup-form__status" value={this.state.task.status} onChange={this.handleChange} >
        <option value="1">Новая</option>
        <option value="2">В работе</option>
        <option value="3">Завершена</option>
      </select>
     );
    }
    
    //planeDate


    return (
      <div id="popup" className='popup'>
        <div className="popup-wrap">
        <button onClick={this.props.closePopup} className="popup-close">Закрыть</button>
        <h2>{title}</h2>
        {/* <form onSubmit={() => this.props.handleSubmit(this.state.task)} className="popup-form"> */}
        <form onSubmit={this.handleSubmit} className="popup-form">
          <div className="popup-form-wrap">
            <label htmlFor="popup-form__descr">Описание</label>
            <input 
              id="popup-form__descr"
              name="descr" 
              type="text" 
              required={true}
              value={this.state.task.descr}
              onChange={this.handleChange} 
              ></input>
          </div>
          <div className="popup-form-wrap">
              <label htmlFor="popup-form__priority">Приоритет</label>
              {priority}
          </div>
          <div className="popup-form-wrap">
              <label htmlFor="popup-form__status">Статус</label>
            {status}
          </div>
          <div className="popup-form-wrap">
              <label htmlFor="popup-form__plan">Планируемая дата окончания</label>
              <input id="popup-form__plan" name="planeDate" type="date" required={true}
              value={this.state.task.planeDate} onChange={this.handleChange}/>
            </div>
            {/* <button type="submit">Сохранить</button> */}
            <input type="submit" value="Submit" />
        </form>
        </div>
      </div>
    );
  }
}
class Task extends React.Component {

  render(){
    let status;
    switch (+this.props.status) {
      case 1:
        status = 'Новая';
        break;
      case 2:
        status = 'В работе';
        break;
      case 3:
        status = 'Завершено';
        break;
    }
    let priority;
    switch (+this.props.priority) {
      case 1:
        priority = 'Низкий';
        break;
      case 2:
        priority = 'Средний';
        break;
      case 3:
        priority = 'Высокий';
        break;
    }
    return (
      <tr key={this.props.id}>
        <td>{this.props.descr}</td>
        <td>{status}</td>
        <td>{priority}</td>
        <td>{this.props.planeDate}</td>
        <td>{this.props.factDate}</td>
        <td>
          <button className="editTaskBtn" onClick={() => this.props.togglePopup(this.props.id)}>Изменить задачу</button>
          <button className="remove" onClick={() => this.props.removeTask(this.props.id)}>Удалить</button>
        </td>
      </tr>
    );
  }
}

class List extends React.Component {

  render() {
    const tasks = this.props.tasks;
    let list =[];
    tasks.forEach((task, key) => {
      if (task.descr.indexOf(this.props.search) >= 0){
        if ((task.status == this.props.filter) || (this.props.filter == 0)){
          list.push(
              <Task
                id = {key}
                descr = {task.descr}
                priority = {task.priority}
                status = {task.status}
                planeDate = {task.planeDate}
                factDate = {task.factDate}
                removeTask = {(key)=>this.props.removeTask(key)}
                // onClick={()=> this.props.onClick(key)}
                togglePopup={(key)=> this.props.togglePopup(key)} 
              />
          );
        }
      }
    });

    return(
      
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
    )
  }
}

class App extends React.Component {
  constructor (props) {
    super(props);
    let mapTasks = new Map(
      [
        [1, {
          descr: 'task 1',
          priority: 1,
          status: 1,
          planeDate: '2020-02-28', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        }],
        [2, {
          descr: 'task 2',
          priority: 2,
          status: 1,
          planeDate: '2020-03-01', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        }],
        [3, {
          descr: 'task 3',
          priority: 1,
          status: 2,
          planeDate: '2020-06-21', //Пока будем хранить в строке, при необходимости преобразуем в дату
          factDate: '',
        }],
      ]
    );
    this.state = {
      popupTaskId : 0,
      showPopup : false,
      filter : 0,
      search: '',
      tasks: mapTasks,
    }
    this.setSearch = this.setSearch.bind(this);
  }

  removeTask(taskId){
    let tasks = this.state.tasks;
    tasks.delete(taskId);
    this.setState({
      tasks : tasks,
    })
  }

  togglePopup(taskId) {
    this.setState({
      popupTaskId: taskId,
      showPopup: !this.state.showPopup,
    });
  }

  handleSubmit(task){
    let tasks = this.state.tasks;
    if (this.state.popupTaskId > 0){
      tasks.set(this.state.popupTaskId, task);
    } else {
      tasks.set(this.state.tasks.size + 1, task);
    }
    if (task.status == 3) {
      const newDate = new Date();
      const separator = '-';
      let date = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      const nowDate = `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`;
      task.factDate = nowDate;
    }
    this.setState({
      tasks: tasks,
      showPopup: false,
    });
  }
  

  setFilter (event){
    this.setState({
      filter: event.target.value,
    })
  }
  setSearch (event){
    this.setState({
      search: event.target.value,
    })
  }
  render() {
    let countNew = 0, countInProcess = 0, countComplete = 0;
    this.state.tasks.forEach((task) => {
      if (task.status == 1) {
        countNew++;
      }
      if (task.status == 2) {
        countInProcess++;
      }
      if (task.status == 3) {
        countComplete++;
      }
    });
    return (
      <div className="app">
        {this.state.showPopup ? 
            <Popup
                task={this.state.tasks.get(this.state.popupTaskId)}
                closePopup={this.togglePopup.bind(this)}
                handleSubmit={(task) => this.handleSubmit(task)}
            />
            : null
        }
        <h1>CRUD Задачи</h1>
        <div className="tools">
          <button className="addTaskBtn" onClick={() => this.togglePopup(0)}>Добавить задачу</button>
          {/* <form className="findTask-form" onSubmit={this.setSearch}> */}
            <input type="text" className="findTask__input" value={this.state.value} onChange={this.setSearch} placeholder="Описание задачи"/>
            {/* <button className="findTask__btn" type="submit">Поиск</button> */}
          {/* </form> */}

          <div className="filters" onChange={this.setFilter.bind(this)}>
            <label>
              <input type="radio" name="filter" value="0"/>
              Всего - {this.state.tasks.size}
            </label>
            <label>
              <input type="radio" name="filter" value="1"/>
              Новых - {countNew}
            </label>
            <label>
              <input type="radio" name="filter" value="2"/>
              В работе - {countInProcess}
            </label>
            <label>
              <input type="radio" name="filter" value="3"/>
              Завершено - {countComplete}
            </label>
          </div>
        </div> 
        <List
          tasks = {this.state.tasks}
          filter = {this.state.filter}
          search = {this.state.search}
          togglePopup = {(taskId) => this.togglePopup(taskId)}
          removeTask = {(taskId) => this.removeTask(taskId)}
        />
      </div>

    );
  }
}

// ========================================


ReactDOM.render(

  <App />,
  document.getElementById('root')
);
