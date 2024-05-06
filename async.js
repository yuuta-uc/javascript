const baseUrl = "https://pokeapi.co/api/v2/";

//送信ボタンのイベント
document.getElementById("pokemonForm").addEventListener("submit", async(e) => {
	e.preventDefault();

	//inputから数字の入力
	const pokemonId = document.getElementById("pokemonInput").value;

	//非同期処理の関数実行
	const [JapanesePokemonName, pokemonTypes, pokemonBackImageUrl] = await getPokemon(pokemonId);
		
	//imgタグを作る
	const imgElement = document.createElement('img');
	imgElement.src = pokemonBackImageUrl;
	imgElement.width = 200;
	imgElement.height = 200;

	//imgタグの出力
	const area = document.getElementById("output");
	area.appendChild(imgElement);

	//inputの入力をクリア
	document.getElementById("pokemonInput").value="";
})

//pokemonId -> getPokemon() -> ポケモンのデータの大元(ポケモンの名前（日本語）、画像、タイプ)など
const getPokemon = async(pokemonId) => {
	const url = baseUrl + `pokemon/${pokemonId}`;
	
	//pokemonのすべてのデータ取得
	const pokemonData = await fetch(url).then((response) => response.json());
	
	//pokemonの日本語の名前を取得	
	const JapanesePokemonName = await getJapanesePokemonName(pokemonId);
	console.log(JapanesePokemonName);

	//pokemonの日本語名のタイプの取得
	//ポケモンのタイプは１つしかないものもいれば、2つあるものもいるので配列
	const pokemonTypes  = await getJapnesePokemonTypes(pokemonData.types);

	//pokemonの画像データ（後ろ姿）のurl取得
	const pokemonBackImageUrl = pokemonData.sprites.back_default;

	return [JapanesePokemonName, pokemonTypes, pokemonBackImageUrl];
}

//pokemonId -> getJapanesePokemonName() -> 日本語のポケモンの名前
const getJapanesePokemonName = async(pokemonId) => {
	const url = baseUrl + `pokemon-species/${pokemonId}`;
	const JapanesePokemonName = await fetch(url).then(res => {
		return res.json();
	})
	//よくわからんが、res.json()を変数として受け取ったあとに.name[0].nameとかやるみたい
	return JapanesePokemonName.names[0].name;
}

//pokemonTypeUrls -> getJapnesePokemonTypes() -> 日本語のタイプ名を取得
const getJapnesePokemonTypes = async(urls) => {
	const array = [];
	for(let i = 0; i < urls.length; i++) {
		const JapnesePokemonTypes = await fetch(urls[i].type.url).then(res => {
			return res.json();
		})
		array.push(JapnesePokemonTypes.names[0].name);
	}
	//Promise.allの引数に[res.json(), res.json,...] みたいにfetchの配列を入れる
	const data = Promise.all(array);

	return data;
}

