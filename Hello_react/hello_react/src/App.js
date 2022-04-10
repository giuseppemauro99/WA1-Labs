import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {Container, Row, Col} from 'react-bootstrap';
import dayjs from 'dayjs';
import {ExamScores} from './components/examComponents.js';

const fakeExamList = [
  {code:'abc1', date: dayjs("2022-01-01"), score:15},
  {code:'abc2', date: dayjs("2022-01-02"), score:27},
  {code:'abc3', date: dayjs("2022-01-03"), score:20}
]

function PageTitle(){
  return(
    <Col>
      <h1>My Fake Exam List</h1>
    </Col>
  );
}

function App() {
  return (
    <Container className='App'>
      <Row>
        <PageTitle />
      </Row>
      <Row>
        <ExamScores exams={fakeExamList}/>
      </Row>
    </Container>
  );
}

export default App;
