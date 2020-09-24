// скрипт создает отчет по статистике на основе файла c узерагентами
// скрипт может сравнивать отчеты, чтобы получить информацию о том, увеличилась ли скорость или нет.


const sortNumber = (a, b) => {
  return a - b;
}


const quantile = (array, percentile) => {
  array.sort(sortNumber);
  let index = percentile / 100. * (array.length - 1);
  if (Math.floor(index) === index) {
    return array[index];
  }
  let i = Math.floor(index)
  let fraction = index - i;
  return array[i] + (array[i + 1] - array[i]) * fraction;
}

const median = (array) => {
  let half = Math.floor(array.length / 2);
  array.sort(sortNumber);
  if (array.length % 2) {
	return array[half];
  }
  return (array[half - 1] + array[half]) / 2.0;
}

// считаем медиан сравниваем с кватилем 95%
