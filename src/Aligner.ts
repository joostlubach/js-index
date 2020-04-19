import * as vscode from 'vscode'

export default class Aligner {

  constructor(
    readonly marker: string = '|'
  ) {}

  align(lines: string[]) {
    const alignmentPositions = []
  
    for (const [i, line] of lines.entries()) {
      const [stripped, positions] = this.stripAlignmentMarkersFromLine(line)
      alignmentPositions[i] = positions
      lines[i] = stripped
    }
  
    // N: the maximum number of alignment positions in any line
    const n = Math.max(...alignmentPositions.map(p => p.length))
  
    for (let markerIdx = 0; markerIdx < n; markerIdx++) {
      // Find where to align this marker at for each line by figuring out the maximum
      // position.
      const alignAt = Math.max(...alignmentPositions.map(p => p[markerIdx] || 0))
  
      // Align each line. Skip the lines that don't have this marker anymore.
      for (const [lineIdx, line] of lines.entries()) {
        const pos = alignmentPositions[lineIdx][markerIdx]
        if (pos == null) { continue }
  
        // Insert spaces to align this line.
        lines[lineIdx] = line.slice(0, pos) + Array(alignAt - pos + 1).join(' ') + line.slice(pos)
  
        // Shift all alignment positions for this line.
        for (let k = markerIdx + 1; k < n; k++) {
          if (alignmentPositions[lineIdx][markerIdx] == null) { break }
          alignmentPositions[lineIdx][markerIdx] += alignAt - pos
        }
      }
    }
  
    return lines
  }
  
  stripAlignmentMarkersFromLine(line: string): [string, number[]] {
    const indices = []
  
    let index
    while (index = line.indexOf(this.marker, index), index !== -1) {
      indices.push(index)
      line = line.slice(0, index) + line.slice(index + this.marker.length)
    }
    return [line, indices]
  }
  

}