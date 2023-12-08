const useSleep = (time: number) => {
  return new Promise(reslove => setTimeout(reslove, time))
}

export default useSleep