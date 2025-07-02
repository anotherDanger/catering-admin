export async function fetchDistricts() {
  const regencyId = '3301'
  const res = await fetch(`https://anotherdanger.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`)
  if (!res.ok) throw new Error('Gagal mengambil data kecamatan')
  return res.json()
}

export async function fetchVillagesByDistrict(districtId) {
  const res = await fetch(`https://anotherdanger.github.io/api-wilayah-indonesia/api/villages/${districtId}.json`)
  if (!res.ok) throw new Error('Gagal mengambil data kelurahan/desa')
  return res.json()
}