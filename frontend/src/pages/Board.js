import { customAxios } from "./customAxios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./Board.css";
import { FiSearch } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";

import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import ConvertDate from "../components/ConvertDate";
import Loading from "../components/Loading";

const BoardItem = ({ boardId, img, title, author, date, completed }) => {
  //받아온 날짜를 보기 좋게 변환
  let convertDate;
  convertDate = ConvertDate(date);

  return (
    <>
      {completed ? (
        <div className="completedItemContianer">
          <div className="itemBox">
            <img
              className="itemImg"
              src={`data:image/jpg;base64, ${img}`}
            ></img>
            <div className="itemContent">
              <span className="itemTitle">{title}</span>
              <span className="itemAuthor">{author}</span>
              <span className="itemDate">{convertDate}</span>
              <span className="itemComplete">협약 완료</span>
            </div>
          </div>
        </div>
      ) : (
        <Link to={`/board/list/${boardId}`}>
          <div className="itemContainer">
            <div className="itemBox">
              <img
                className="itemImg"
                src={`data:image/jpg;base64, ${img}`}
              ></img>
              <div className="itemContent">
                <span className="itemTitle">{title}</span>
                <span className="itemAuthor">{author}</span>
                <span className="itemDate">{convertDate}</span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
const Board = () => {
  const [ref, inView] = useInView();
  const [endPage, setEndPage] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState("");
  const [load, setLoad] = useState(true);
  const [search, setSearch] = useState("");
  const getBoardData = async () => {
    if (!endPage) {
      customAxios.get(`/owner/board?page=${page}`).then((response) => {
        //마지막 페이지가 아니라면
        if (response.data.last === false) {
          setData((prev) => [...prev, ...response.data.content]);
          console.log(`${page}번째 페이지 렌더링 `, data);
        }
        //마지막 페이지라면
        else {
          setData((prev) => [...prev, ...response.data.content]);
          setEndPage(true);
          console.log("페이지 끝임", data);
        }
      });
    }
  };
  const searchBoardData = async (keyword) => {
    customAxios.get(`/owner/board?keyword=${keyword}`).then((res) => {
      setData(res.data.content);
      setEndPage(true);
    });
  };
  //맨 처음에 게시판 리스트 렌더링
  useEffect(() => {
    setLoad(true);
    getBoardData();
    console.log("맨 처음에 렌더링 page: ", page, inView);
    setLoad(false);
  }, [page]);

  useEffect(() => {
    // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
    if (inView && !load) {
      console.log("invView: ", inView, "load: ", load);
      console.log("page 업뎃 전", page);
      setPage((prevState) => prevState + 1);
      //getBoardData();
      console.log("인뷰 렌더링 page: ", page);
    }
    console.log("page 업뎃 후", page);
  }, [inView, load]);

  const handleOnKeyPress = (e) => {
    if (e.key == "Enter") {
      if (search === null || search === "") {
        //getBoardData();
      } else {
        //기존 데이터 목록에서 검색어가 포함된 데이터만 추출
        searchBoardData(search);
      }
    }
  };

  if (!data) {
    return <Loading />;
  }

  //onChange 이벤트 발생할 때마다 검색어 최신화
  const onChangeSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const deleteSearchWord = () => {
    setSearch("");
  };

  const moveToWritePage = () => {
    window.location.href = "/board/write";
  };
  return (
    <>
      <Header text={"제휴 맺기 게시판"} back={true} url={"/"}></Header>
      <div className="searchContainer">
        <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
          <div className="serachIcon">
            <FiSearch></FiSearch>
          </div>
          <input
            onKeyPress={handleOnKeyPress}
            className="searchInput"
            type="text"
            value={search}
            placeholder={"검색어를 입력하세요"}
            onChange={onChangeSearch}
          ></input>
          <button className="deleteSearchWordBtn" onClick={deleteSearchWord}>
            <IoMdCloseCircle size={"1.5em"} color={"B8B8B8"}></IoMdCloseCircle>
          </button>
        </form>
        <button className="writeBtn" onClick={moveToWritePage}>
          작성하기
        </button>
      </div>
      {data ? (
        data.map((item, index) => {
          return (
            <BoardItem
              key={index}
              boardId={item.id}
              img={item.image}
              title={item.title}
              author={item.author}
              date={item.createDate}
              completed={item.completed}
            />
          );
        })
      ) : (
        <span>data 없음</span>
      )}
      {data ? <div ref={ref}> </div> : null}
    </>
  );
};

export default Board;
